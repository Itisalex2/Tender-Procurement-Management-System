import { useContext } from 'react';
import { AuthContext } from '../context/auth-context';
import { translations } from '../localization/translations';

const useLocalize = () => {
  const { language } = useContext(AuthContext);

  const localize = (key) => {
    return translations[language][key] || key; // Fallback to the key if no translation exists
  };

  return { localize };
};

export default useLocalize;
