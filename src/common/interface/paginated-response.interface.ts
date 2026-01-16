export interface PaginationMetaFormat {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviosPage: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMetaFormat;
}
