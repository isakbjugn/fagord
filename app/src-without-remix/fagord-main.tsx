import { Route, Routes } from '@remix-run/react';
import { ContactPage } from '~/src-without-remix/pages/contact-page/contact-page';

export default function App() {
  return (
    <Routes>
      <Route path="/kontakt" element={<ContactPage />} />
    </Routes>
  );
}