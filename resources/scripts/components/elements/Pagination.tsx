import React from 'react';
import { PaginatedResult } from '@/api/http';
import tw from 'twin.macro';
import styled from 'styled-components/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';

interface RenderFuncProps<T> {
    items: T[];
    isLastPage: boolean;
    isFirstPage: boolean;
}

interface Props<T> {
    data: PaginatedResult<T>;
    showGoToLast?: boolean;
    showGoToFirst?: boolean;
    onPageSelect: (page: number) => void;
    children: (props: RenderFuncProps<T>) => React.ReactNode;
}

const PageBtn = styled.button<{ $active?: boolean }>`
    ${tw`p-0 w-10 h-10 rounded-lg border text-sm font-medium transition-all duration-150`};
    ${tw`border-white/10 bg-zinc-900/50 backdrop-blur-md text-zinc-300`};
    ${(p) =>
        p.$active &&
        tw`bg-blue-600/20 border-blue-500/35 text-zinc-50 shadow-lg shadow-blue-950/40`};

    &:hover:not(:disabled) {
        ${tw`border-white/18 text-zinc-50 bg-zinc-800/55`};
    }

    &:not(:last-of-type) {
        margin-inline-end: 0.5rem;
    }
`;

function Pagination<T>({ data: { items, pagination }, onPageSelect, children }: Props<T>) {
    const isFirstPage = pagination.currentPage === 1;
    const isLastPage = pagination.currentPage >= pagination.totalPages;

    const pages = [];

    const start = Math.max(pagination.currentPage - 2, 1);
    const end = Math.min(pagination.totalPages, pagination.currentPage + 5);

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    return (
        <>
            {children({ items, isFirstPage, isLastPage })}
            {pages.length > 1 && (
                <div css={tw`mt-6 flex justify-center flex-wrap gap-y-2`} dir={'ltr'}>
                    {pages[0] > 1 && !isFirstPage && (
                        <PageBtn type={'button'} onClick={() => onPageSelect(1)}>
                            <FontAwesomeIcon icon={faAngleDoubleLeft} />
                        </PageBtn>
                    )}
                    {pages.map((i) => (
                        <PageBtn
                            type={'button'}
                            key={`block_page_${i}`}
                            $active={pagination.currentPage === i}
                            onClick={() => onPageSelect(i)}
                        >
                            {i}
                        </PageBtn>
                    ))}
                    {pages[4] < pagination.totalPages && !isLastPage && (
                        <PageBtn type={'button'} onClick={() => onPageSelect(pagination.totalPages)}>
                            <FontAwesomeIcon icon={faAngleDoubleRight} />
                        </PageBtn>
                    )}
                </div>
            )}
        </>
    );
}

export default Pagination;
