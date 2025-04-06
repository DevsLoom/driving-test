import Panel from "~/src/layouts/Panel";

const Dashboard = () => {
    return <div>Dashboard</div>;
};
Dashboard.layout = (page: any) => <Panel children={page} title="Dashboard" />;
export default Dashboard;
