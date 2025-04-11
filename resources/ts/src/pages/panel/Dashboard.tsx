import SummaryCard from "~/src/components/panel/SummaryCard";
import Panel from "~/src/layouts/Panel";
import { useFetchSummariesQuery } from "~/src/store/actions/slices/global/summaries";

const Dashboard = () => {
    const { data, isFetching } = useFetchSummariesQuery("");

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            <SummaryCard
                label="Total Test"
                value={data?.total_test}
                bg="green.1"
                c="green"
                icon="qlementine-icons:test-16"
                loading={isFetching}
            />
            <SummaryCard
                label="Total Question"
                value={data?.total_question}
                bg="pink.1"
                c="pink"
                icon="radix-icons:question-mark"
                loading={isFetching}
            />
            <SummaryCard
                label="Total Question Category"
                value={data?.total_question_category}
                bg="orange.1"
                c="orange"
                icon="proicons:chat-question"
                loading={isFetching}
            />
        </div>
    );
};
Dashboard.layout = (page: any) => <Panel children={page} title="Dashboard" />;
export default Dashboard;
