import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';
import { TcharizeLanguageSwitcher } from './components/TcharizeLanguageSwitcher';

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <TcharizeLanguageSwitcher />
      <Toaster />
    </>
  );
}
