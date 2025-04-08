import { Box, Text } from "@mantine/core";
import { FC, lazy, Suspense, useEffect, useRef } from "react";
import "suneditor/dist/css/suneditor.min.css";

const SunEditor = lazy(() => import("suneditor-react"));

const EditorBox: FC<{
    label?: string;
    height?: string;
    placeholder?: string;
    value?: string;
    onChange: (value: string) => void;
    buttonList?: string[];
    error?: string;
    withAsterisk?: boolean;
    disabled?: boolean;
}> = ({
    label,
    height = "500px",
    placeholder,
    value,
    error,
    withAsterisk = false,
    disabled = false,
    onChange,
    buttonList = [
        "undo",
        "redo",
        "formatBlock",
        "bold",
        "italic",
        "underline",
        "strike",
        "removeFormat",
        "fontSize",
        "fontColor",
        "hiliteColor",
        "align",
        "list",
        "link",
        "image",
        "video",
        "table",
        "fullScreen",
        "showBlocks",
        "preview",
        "codeView",
        "print",
    ],
}) => {
    const editorRef = useRef<any>(null);
    const handleEditorInstance = (editor: any) => {
        editorRef.current = editor;
    };

    useEffect(() => {
        if (editorRef.current && value !== undefined) {
            const currentContent = editorRef.current.getContents();
            if (currentContent !== value) {
                editorRef.current.setContents(value || "");
            }
        }
    }, [value]);

    return (
        <Box className="!z-10">
            <Text size="sm" mb={1} fw={500}>
                {label}{" "}
                {withAsterisk && <span className="text-red-400">*</span>}
            </Text>
            <Suspense fallback={<p>Loading editor...</p>}>
                <SunEditor
                    defaultValue={value}
                    onChange={(content: string) => onChange(content)}
                    getSunEditorInstance={handleEditorInstance}
                    setOptions={{
                        height: height,
                        buttonList: [buttonList],
                        placeholder: placeholder,
                        charCounter: false,
                        charCounterType: "byte",
                        resizingBar: true,
                    }}
                    disable={disabled}
                />
            </Suspense>

            {error ? (
                <Text size="xs" mt={2} c="pink">
                    {error}
                </Text>
            ) : (
                ""
            )}
        </Box>
    );
};

export default EditorBox;
