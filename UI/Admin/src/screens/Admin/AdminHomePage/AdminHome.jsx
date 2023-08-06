// Importing required components and modules
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut, Pie } from "react-chartjs-2";
import { Card, CardBody, Typography } from "@material-tailwind/react";

const AdminHome = () => {
  // Registering the necessary Chart.js components to be used in the charts
  ChartJS.register(ArcElement, Tooltip, Legend);

  // Sample data for the charts
  const data = {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex flex-col lg:flex-row justify-center gap-7 pt-2">
      {/* Creating a Card with a Doughnut chart for Active Users */}
      <Card className="w-full lg:w-1/3">
        <Doughnut data={data} className="pt-3 pb-3 pl-3 pr-3" />
        <CardBody className="text-center">
          <Typography>Active Users</Typography>{" "}
        </CardBody>
      </Card>

      {/* Creating a Card with a Pie chart for Active Organizers */}
      <Card className="w-full lg:w-1/3">
        <Pie data={data} className="pt-3 pb-3 pl-3 pr-3" />
        <CardBody className="text-center">
          <Typography>Active Organizers</Typography>{" "}
        </CardBody>
      </Card>
      {/* Creating a Card with another Doughnut chart for Active Events */}

      <Card className="w-full lg:w-1/3">
        <Doughnut data={data} className="pt-3 pb-3 pl-3 pr-3" />
        <CardBody className="text-center">
          <Typography>Active Events</Typography>{" "}
        </CardBody>
      </Card>
    </div>
  );
};

export default AdminHome;
