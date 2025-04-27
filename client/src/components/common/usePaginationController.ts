import {useState} from "react";

type RowsPerPageOptions = number | { value: number; label: string; }

export interface PaginationController {
    count: number;
    rowsPerPageOptions: RowsPerPageOptions[];
    rowsPerPage: number;
    page: number;
    sliceFrom: () => number;
    sliceTo: () => number;
    changePage: (event: any, newPage: number) => void;
    changeRowsPerPage: (event: any) => void;
}

export const usePaginationController = (count: number): PaginationController => {
    const [rowsPerPageOptions] = useState<RowsPerPageOptions[]>([10, 25, 50, { label: "All", value: -1 }]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);

    const changePage = (event: any, newPage: number) => {
        setPage(newPage);
    };

    const changeRowsPerPage = (event: any) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const sliceFrom = () => {
        return page * rowsPerPage
    }

    const sliceTo = () => {
        return page * rowsPerPage + rowsPerPage
    }

    return {
        count,
        rowsPerPageOptions,
        rowsPerPage,
        page,
        sliceFrom,
        sliceTo,
        changePage,
        changeRowsPerPage
    }
}