import Box from "@mui/material/Box";
import {CardContent, CircularProgress, Grid, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";

interface DashboardCardProps {
    title: string;
    currentMonth: string;
    currentMonthStats: string | number;
    pastMonth: string;
    pastMonthStats: string | number;
    color: string;
    imgPath: string;
    isLoading: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
    title,
    currentMonth,
    currentMonthStats,
    pastMonth,
    pastMonthStats,
    color,
    imgPath,
    isLoading
}) => {
    return (
        <Box bgcolor={color + ".light"} textAlign="center">
            <CardContent>
                {isLoading ? (
                    <CircularProgress />
                ) : (
                    <>
                        <img src={imgPath} width="30" height="30" />
                        <Stack direction={"row"} spacing={2} justifyContent="space-between">
                            <Typography color={color + ".main"} mt={1} variant="subtitle1" fontWeight={600}>
                                {title + " " + currentMonth.substring(0, 2)}
                            </Typography>
                            <Typography color={color + ".main"} variant="h4" fontWeight={600}>
                                {currentMonthStats}
                            </Typography>
                        </Stack>

                        <Stack direction={"row"} spacing={2} justifyContent="space-between">
                            <Typography color={color + ".main"} mt={1} variant="caption" fontWeight={300}>
                                {title + " " + pastMonth.substring(0, 2)}
                            </Typography>
                            <Typography color={color + ".main"} variant="caption" fontWeight={300}>
                                {pastMonthStats}
                            </Typography>
                        </Stack>
                    </>
                )}
            </CardContent>
        </Box>
    );
};
export default DashboardCard;