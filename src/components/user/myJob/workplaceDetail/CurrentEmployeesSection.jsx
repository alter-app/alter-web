import styled from 'styled-components';
import ManagersSection from './ManagersSection';
import WorkersSection from './WorkersSection';

const CurrentEmployeesSection = ({ managers, workers }) => {
    console.log('CurrentEmployeesSection 렌더링:', {
        managersCount: managers?.length || 0,
        workersCount: workers?.length || 0,
        managers: managers,
        workers: workers,
    });

    return (
        <Container>
            <ManagersSection managers={managers || []} />
            <WorkersSection workers={workers || []} />
        </Container>
    );
};

export default CurrentEmployeesSection;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0;
`;
