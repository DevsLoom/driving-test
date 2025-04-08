import FilePondPluginImageCrop from "filepond-plugin-image-crop";
import FilePondPluginImageEdit from "filepond-plugin-image-edit";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageResize from "filepond-plugin-image-resize";
import FilePondPluginImageTransform from "filepond-plugin-image-transform";
import React, { FC, useState } from "react";
import { FilePond, FilePondProps, registerPlugin } from "react-filepond";

/**
 * Styles
 */
import { Icon } from "@iconify/react";
import { ActionIcon, Box, Flex, Image, Stack, Text } from "@mantine/core";
import { ActualFileObject } from "filepond";
import "filepond-plugin-image-edit/dist/filepond-plugin-image-edit.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond/dist/filepond.min.css";
import { imageUrlBuilder } from "~/src/lib/helpers";

registerPlugin(
    FilePondPluginImageExifOrientation,
    FilePondPluginImagePreview,
    FilePondPluginImageCrop,
    FilePondPluginImageResize,
    FilePondPluginImageTransform,
    FilePondPluginImageEdit,
);

type FileUploaderProps = FilePondProps & {
    attachments?: string | string[];
    changeHandler?: (data: string | string[], action: string) => void;
    onRemove?: () => void;
    label?: string;
    error?: boolean;
    labelColor?: string;
    helperText?: string;
    helperTextColor?: string;
};

const getFileType = (src) => {
    if (src) {
        let type = "";
        const fileExt = src.split(".").pop().toLowerCase();

        if (["pdf", "doc", "docx", "xls", "xlsx"].includes(fileExt)) {
            type = "file";
        } else if (["png", "jpg", "jpeg", "gif"].includes(fileExt)) {
            type = "image";
        }

        return type;
    }
};

const RenderImage: FC<{ src: string; onRemove?: () => void }> = ({
    src,
    onRemove,
}) => {
    return (
        <Box pos="relative">
            <ActionIcon
                radius="xl"
                color="red.4"
                pos="absolute"
                top={-8}
                right={-8}
                onClick={onRemove}
                size="xs"
            >
                <Icon icon="mdi:trash" fontSize={12} />
            </ActionIcon>
            {getFileType(src) === "file" ? (
                <Box w={80} h={80}>
                    <iframe src={src} width="100%" height="100%" />
                </Box>
            ) : (
                <Image
                    src={imageUrlBuilder(src)}
                    w={80}
                    h={80}
                    radius="xs"
                    fit="fill"
                />
            )}
        </Box>
    );
};

const FileUploader: React.FC<FileUploaderProps> = ({
    label,
    attachments,
    changeHandler = () => {},
    onRemove = () => {},
    allowMultiple = false,
    server = "/api/v1/media-files",
    acceptedFileTypes = ["image/png, image/jpeg, image/gif"],
    ...props
}) => {
    const [files, setFiles] = useState<ActualFileObject[]>([]);

    return (
        <Stack gap={1}>
            {label && (
                <Text size="sm" fw={500}>
                    {label}
                </Text>
            )}
            {attachments ? (
                <Flex gap={1}>
                    {typeof attachments === "string" ? (
                        <RenderImage src={attachments} onRemove={onRemove} />
                    ) : (
                        attachments?.map((item, i) => (
                            <RenderImage
                                src={item}
                                key={i}
                                onRemove={onRemove}
                            />
                        ))
                    )}
                </Flex>
            ) : (
                <FilePond
                    files={files}
                    onupdatefiles={(fileItems) => {
                        const items = fileItems.map(
                            (fileItem) => fileItem.file,
                        );
                        setFiles(items);
                    }}
                    onprocessfile={(_, file) => {
                        const res = JSON.parse(file.serverId);
                        if (res?.status === "success") {
                            changeHandler(res.data, "add");
                            setFiles([]);
                        }
                    }}
                    acceptedFileTypes={acceptedFileTypes}
                    allowMultiple={allowMultiple}
                    server={server}
                    name="file"
                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                    className="file-uploader"
                    {...props}
                />
            )}
        </Stack>
    );
};

export default FileUploader;
