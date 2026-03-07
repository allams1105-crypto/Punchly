import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirige automáticamente al idioma por defecto
  redirect('/es');
}