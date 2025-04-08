<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Media\MediaStoreRequest;
use App\Models\Media;
use Exception;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Laravel\Facades\Image;

class MediaController extends Controller
{
    public function index()
    {
        try {
            $offset    = request()->input('offset') ?? 20;
            $fields    = ['id', 'name', 'extension', 'size', 'type', 'path'];
            $condition = [];

            if (request()->has('type') && request()->input('type')) {
                $condition['type'] = request()->input('type');
            }

            $queries = Media::query();

            if (request()->has('search') && request()->input('search')) {
                $queries = $queries->where('name', 'like', '%' . request()->input('search') . '%');
            }

            if (request()->has('get_all') && (int) request()->input('get_all') === 1) {
                $queries = $queries->select($fields)->where($condition)->latest()->get();
            } else {
                $queries = paginate($queries->select($fields)->where($condition)->paginate($offset)->toArray());
            }

            return entityResponse($queries);
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }

    public function storageFiles()
    {
        try {
            $baseFolder = request()->input('folder');

            if (!file_exists(public_path("uploads/{$baseFolder}"))) {
                return entityResponse([]);
            }

            $folders = [];
            $dirs    = File::directories("uploads/{$baseFolder}");

            foreach ($dirs as $dir) {
                $name    = explode('/', $dir);
                $payload = [
                    'name'      => $name[count($name) - 1],
                    'is_dir'    => true,
                    'thumbnail' => 'https://static-00.iconduck.com/assets.00/folder-icon-512x410-jvths5l6.png',
                    'children'  => [],
                ];

                $r = $this->getFiles($dir);
                if (count($r['data'])) {
                    if ($r['folder']) {
                        $payload['children'][] = $r['data'];
                    } else {
                        $payload['children'] = $r['data'];
                    }
                }

                $folders[] = $payload;
            }
            return entityResponse($folders);
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }

    private function getFiles($dir)
    {
        $dirLooper  = true;
        $payload    = [];
        $directions = File::directories($dir);

        if (count($directions)) {
            foreach ($directions as $directory) {
                $name    = explode('/', $directory);
                $payload = [
                    'name'      => $name[count($name) - 1],
                    'is_dir'    => true,
                    'thumbnail' => 'https://static-00.iconduck.com/assets.00/folder-icon-512x410-jvths5l6.png',
                    'children'  => [],
                ];

                $folders = File::directories($directory);
                foreach ($folders as $index => $folder) {
                    $fName                 = explode('/', $folder);
                    $payload['children'][] = [
                        'name'      => $fName[count($fName) - 1],
                        'is_dir'    => true,
                        'thumbnail' => 'https://static-00.iconduck.com/assets.00/folder-icon-512x410-jvths5l6.png',
                        'children'  => [],
                    ];

                    $r = $this->getFiles($folder);
                    if (count($r['data'])) {
                        if ($r['folder']) {
                            $payload['children'][$index]['children'][] = $r['data'];
                        } else {
                            $payload['children'][$index]['children'] = $r['data'];
                        }
                    }
                }

                $files = File::files($directory);
                foreach ($files as $file) {
                    $payload['children'][] = [
                        'name'      => $file->getFilename(),
                        'extension' => $file->getExtension(),
                        'size'      => $file->getSize(),
                        'is_dir'    => false,
                        'link'      => request()->getSchemeAndHttpHost() . '/' . $file->getPathname(),
                    ];
                }
            }
        } else {
            $dirLooper = false;
            $files     = File::files($dir);
            foreach ($files as $file) {
                $payload[] = [
                    'name'      => $file->getFilename(),
                    'extension' => $file->getExtension(),
                    'size'      => $file->getSize(),
                    'is_dir'    => false,
                    'link'      => request()->getSchemeAndHttpHost() . '/' . $file->getPathname(),
                ];
            }
        }

        return ['data' => $payload, 'folder' => $dirLooper];
    }

    public function store(MediaStoreRequest $request)
    {
        try {
            if ($request->has('file')) {
                if ($request->file('file')) {
                    $file   = $request->file('file');
                    $images = ['jpg', 'jpeg', 'png', 'bmp', 'gif', 'webp'];

                    $fileName         = strtolower(Str::random(15)) . '.' . $file->getClientOriginalExtension();
                    $fileOriginalName = $file->getClientOriginalName();
                    $fileType         = 'image';
                    $extension        = $file->getClientOriginalExtension();
                    $fileSize         = $file->getSize();

                    if (str_contains($file->getClientMimeType(), 'image')) {
                        $fileType = 'image';
                    } elseif (str_contains($file->getClientMimeType(), 'video')) {
                        $fileType = 'video';
                    } else {
                        $fileType = 'file';
                    }

                    if (in_array($extension, $images)) {
                        $uploadedUrl = $this->saveFile($file, $fileName, $fileOriginalName, $extension, $fileType, $fileSize);
                    } else {
                        $uploadedUrl = $this->saveFile($file, $fileName, $fileOriginalName, $extension, $fileType, $fileSize);
                    }
                    return entityResponse($uploadedUrl, 201, 'success', 'File uploaded successfully');
                } elseif ($request->input('file')) {
                    $file = $request->input('file');
                    if (str_contains($file, 'data:')) {
                        $file        = str_replace('data:image/png;base64,', '', $file);
                        $file        = str_replace(' ', '+', $file);
                        $fileName    = strtolower(Str::random(15)) . '.png';
                        $uploadedUrl = $this->saveFile(base64_decode($file), $fileName);
                        return entityResponse($uploadedUrl, 201, 'success', 'File uploaded successfully');
                    }
                }
            }
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }

    private function saveFile($file, $name = '', $originalName = '', $extension = '', $type = 'image', $size = 0): string
    {
        $dir = match ($type) {
            'video' => 'videos',
            'file' => 'files',
            default => 'images'
        };

        $payload = [
            'name'      => $originalName,
            'extension' => $extension,
            'type'      => $type,
            'size'      => $size,
            'path'      => "uploads/{$dir}/{$name}",
        ];

        if ($type === 'image') {
            $img = Image::read($file);

            if (Storage::disk('regular')->put("{$dir}/{$name}", $img->encode())) {
                Media::query()->create($payload);
            }
        } else {
            if (Storage::disk('regular')->putFileAs("{$dir}", $file, $name)) {
                Media::query()->create($payload);
            }
        }

        // return request()->getSchemeAndHttpHost() . "/uploads/{$dir}/{$name}";
        return "/uploads/{$dir}/{$name}";
    }

    public function destroy(string $id)
    {
        try {
            $searchKey = request()->input('searchKey') ?? 'id';
            $condition = [$searchKey => $id];
            if (!$query = Media::query()->where($condition)->first()) {
                return messageResponse();
            }

            if (!file_exists(public_path($query->path))) {
                return messageResponse();
            }
            unlink(public_path($query->path));

            $query->delete();
            return messageResponse('Media file deleted successfully', 200, 'success');
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }

}
