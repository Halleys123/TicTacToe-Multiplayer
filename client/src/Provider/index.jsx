import AuthProvider from './AuthProvider';
import LoadingProvider from './LoadingProvider';
import MessageProvider from './MessageProvider';
import SocketProvider from './SocketProvider';

export function Providers({ children }) {
  return (
    <LoadingProvider>
      <AuthProvider>
        <SocketProvider>
          <MessageProvider>{children}</MessageProvider>
        </SocketProvider>
      </AuthProvider>
    </LoadingProvider>
  );
}
