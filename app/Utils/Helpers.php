<?php

if (!function_exists('entityResponse')) {
    function entityResponse($data = null, $statusCode = 200, $status = 'success', $message = null)
    {
        $payload = ['status' => $status, 'statusCode' => $statusCode, 'data' => $data];

        if ($message) {
            $payload['message'] = $message;
        }

        return response($payload, $statusCode);
    }
}

if (!function_exists('messageResponse')) {
    function messageResponse($message = '', $statusCode = 200, $status = 'success')
    {
        return response(['status' => $status, 'statusCode' => $statusCode, 'message' => $message], $statusCode);
    }
}

if (!function_exists('validateError')) {
    function validateError($data, $override = false)
    {
        $errors       = [];
        $errorPayload = !$override ? $data->getMessages() : $data;
        foreach ($errorPayload as $key => $value) {
            $errors[$key] = $value[0];
        }
        return response(['status' => 'validate_error', 'statusCode' => 422, 'data' => $errors], 422);
    }
}

if (!function_exists('primaryKey')) {
    function primaryKey()
    {
        return str_contains(config('db.default'), 'mongo') ? '_id' : 'id';
    }
}

if (!function_exists('paginate')) {
    function paginate($payload, $count, $offset)
    {
        return ['data' => $payload, 'next_offset' => $offset, 'total' => $count];
    }
}
