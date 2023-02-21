import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import PaginationStyleWrapper from "./Pagination.style";

const Pagination = () => {
  return (
    <PaginationStyleWrapper className="pagination_wrapper">
      <Link href="# ">
        <FiChevronLeft />
      </Link>
      <Link href="# ">
        1
      </Link>
      <Link href="# ">
        2
      </Link>
      <Link href="# " className="active">
        3
      </Link>
      <Link href="# ">
        4
      </Link>
      <Link href="# ">
        5
      </Link>
      <Link href="# ">
        <FiChevronRight />
      </Link>
    </PaginationStyleWrapper>
  );
};

export default Pagination;
