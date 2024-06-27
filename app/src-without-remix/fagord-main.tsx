import { Route, Routes } from '@remix-run/react';
import { ContactPage } from '~/src-without-remix/pages/contact-page/contact-page';
import { AboutPage } from '~/src-without-remix/pages/about-page/about-page';

export default function App() {
  return (
    <Routes>
      <Route path="/om-oss" element={<AboutPage />} />
      <Route path="/kontakt" element={<ContactPage />} />
    </Routes>
  );
}