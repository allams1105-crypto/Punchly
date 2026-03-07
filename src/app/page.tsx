import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirige al usuario al idioma por defecto (español)
  redirect('/es');
}