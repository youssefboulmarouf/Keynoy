import {useTheme} from "@mui/material/styles";
import Chart from "react-apexcharts";
import React, {useEffect, useState} from "react";
import {ApexOptions} from "apexcharts";
import {Card, CardContent, CardHeader} from "@mui/material";
import Divider from "@mui/material/Divider";

interface MultyStatsChartProps {
    cardTitle: string;
    chartData: Map<string, { income: number; expense: number }>;
}

const MultyStatsChartChart: React.FC<MultyStatsChartProps> = ({
    cardTitle,
    chartData
}) => {
    const theme = useTheme();
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.error.main;

    const [chartOptions, setChartOptions] = useState<ApexOptions>({});
    const [chartSeries, setChartSeries] = useState<any[]>([]);

    useEffect(() => {
        const categories = Array.from(chartData.keys());
        const incomeValues = Array.from(chartData.values()).map((v) => Number(v.income));
        const expenseValues = Array.from(chartData.values()).map((v) => Number(v.expense));

        setChartOptions({
            chart: {
                height: 350,
                type: "line",
                foreColor: "#adb0bb",
                toolbar: { show: false },
                dropShadow: {
                    enabled: true,
                    color: "rgba(0,0,0,0.2)",
                    top: 12,
                    left: 4,
                    blur: 3,
                    opacity: 0.4,
                },
            },
            stroke: {
                width: 3,
                curve: "smooth",
            },
            xaxis: {
                type: "category",
                categories,
            },
            markers: {
                size: 4,
                strokeOpacity: 0.9,
                colors: [primary, secondary],
                strokeColors: "#fff",
                strokeWidth: 2,
                hover: { size: 7 },
            },
            tooltip: {
                theme: "dark",
            },
            grid: {
                show: false,
            },
            legend: {
                position: "top",
                horizontalAlign: "right",
            },
        });

        setChartSeries([
            {
                name: "Income",
                data: incomeValues,
            },
            {
                name: "Expense",
                data: expenseValues,
            },
        ]);
    }, [chartData]);

    return (
        <Card sx={{ padding: 0, borderColor: (theme) => theme.palette.divider }} variant="outlined">
            <CardHeader title={cardTitle} />
            <Divider />
            <CardContent>
                <Chart
                    options={chartOptions}
                    series={chartSeries}
                    type="line"
                    height="500px"
                    width={"100%"}
                />
            </CardContent>
        </Card>
    );
};

export default MultyStatsChartChart;