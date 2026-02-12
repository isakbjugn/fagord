import { Outlet, useNavigation } from 'react-router';
import { Loader } from '~/lib/components/loader';

export default function TermlisteLayout() {
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

  return isLoading ? <Loader /> : <Outlet />;
}
