import { useNavigate, useLocation } from 'react-router';
import i18n from '../i18n';

const useChangeLanguage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const changeLanguage = (lng: 'en' | 'id' | 'jp') => {
    const currentPath = location.pathname;
    let newPath = '';

    // Jika bahasa baru adalah default (en), hapus prefix bahasa dari path saat ini
    if (lng === 'en') {
      // Hapus prefix bahasa yang mungkin ada
      newPath = currentPath.replace(/^\/(id|jp)\//, '/');
      // Jika path hanya berisi prefix bahasa, ganti ke '/'
      if (newPath === '/' + location.pathname.split('/')[1]) {
         newPath = '/';
      }
    } else {
      // Jika bukan bahasa default, tambahkan prefix bahasa
      // Hapus prefix bahasa lama jika ada
      const strippedPath = currentPath.replace(/^\/(id|jp)\//, '/');
      newPath = `/${lng}${strippedPath}`;
    }

    // Ganti bahasa di i18next
    i18n.changeLanguage(lng);

    // Navigasi ke URL baru tanpa menyimpan ke history
    navigate(newPath, { replace: true });
  };

  return { changeLanguage, currentLanguage: i18n.language };
};

export { useChangeLanguage }; // named export
export default useChangeLanguage; // default export