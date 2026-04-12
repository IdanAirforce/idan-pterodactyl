import styled from 'styled-components/macro';
import tw from 'twin.macro';

const SubNavigation = styled.div`
    ${tw`w-full overflow-x-auto`};
    background: rgba(24, 24, 27, 0.55);
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);

    & > div {
        ${tw`flex items-center text-sm mx-auto px-3 sm:px-5 gap-1`};
        max-width: 72rem;

        & > a,
        & > div {
            ${tw`inline-block py-3 px-3 sm:px-4 text-zinc-400 no-underline whitespace-nowrap transition-all duration-150 rounded-lg border border-transparent`};

            &:hover {
                ${tw`text-zinc-100 bg-white/5 border-white/10`};
            }

            &:active,
            &.active {
                ${tw`text-zinc-50 bg-white/8 border-white/12`};
                box-shadow: inset 0 -2px rgba(59, 130, 246, 0.45);
            }
        }
    }
`;

export default SubNavigation;
