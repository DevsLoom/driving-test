import { Icon } from "@iconify/react";
import { Loader } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { FC, useState } from "react";
import { mapSelect } from "~/src/lib/helpers";
import { useFetchTagsQuery } from "~/src/store/actions/slices/global/tags";
import TagBox from "../ui/TagBox";

const SearchTags: FC<{
    value: string[] | undefined;
    onChange: () => void;
    error: string | undefined;
}> = ({ value, onChange, error }) => {
    const [searchTag, setSearchTag] = useState("");
    const [debouncedSearchTag] = useDebouncedValue(searchTag, 300);

    const { data: tags, isFetching: isTagsFetching } = useFetchTagsQuery(
        `search=${debouncedSearchTag}`,
        {
            skip: !debouncedSearchTag,
            refetchOnMountOrArgChange: true,
        },
    );

    return (
        <TagBox
            leftSection={<Icon icon="mi:tag" />}
            label="Meta Tags"
            value={value}
            onChange={onChange}
            error={error}
            data={mapSelect(tags, "name", "id")}
            searchValue={searchTag}
            onSearchChange={(value: string) => setSearchTag(value)}
            placeholder="Search..."
            rightSection={isTagsFetching ? <Loader size={12} /> : ""}
        />
    );
};

export default SearchTags;
