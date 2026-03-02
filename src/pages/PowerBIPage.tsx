import { PowerBIFlow } from '@/components/powerbi/PowerBIFlow';
import { useNavigate } from 'react-router-dom';

const PowerBIPage = () => {
  const navigate = useNavigate();

  return (
    <PowerBIFlow
      fileName="Dashboard Report"
      onBack={() => navigate('/')}
    />
  );
};

export default PowerBIPage;
