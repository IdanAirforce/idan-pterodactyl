import styled from 'styled-components/macro';
import tw from 'twin.macro';

const ContentContainer = styled.div`
    max-width: 72rem;
    ${tw`mx-auto w-full px-4 sm:px-6`};
`;
ContentContainer.displayName = 'ContentContainer';

export default ContentContainer;
