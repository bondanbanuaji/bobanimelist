import { useEffect, useRef, useState, useCallback } from "react";
import AnimeIcon from "../../atoms/icons/AnimeIcon";
import HomeIcon from "../../atoms/icons/HomeIcon";
import Logo from "../../atoms/logo";
import MangaIcon from "../../atoms/icons/MangaIcon";
import SearchIcon from "../../atoms/icons/SearchIcon";
import SettingIcon from "../../atoms/icons/SettingIcon";
import Pill from "../../atoms/pill";
import styles from "./Header.module.scss";
import GithubIcon from "../../atoms/icons/GithubIcon";
import LanguageIcon from "../../atoms/icons/LanguageIcon";
import { Link, useLocation } from "react-router";
import { useTranslation } from 'react-i18next'; // Impor hook i18n
import classNames from "classnames";
import MenuIcon from "../../atoms/icons/MenuIcon";
import { useAppDispatch, useAppSelector } from "../../../store";
import { updateIsDrawerOpen, updateIsHeaderNavHidden } from "../../../store/slices/appContextSlice";
import { useChangeLanguage } from "../../../hooks/useChangeLanguage";
import { VernacUtil } from "../../../services/vernac/vernac-util";

function HeaderNav() {
  const location = useLocation();
  const { t } = useTranslation(); // Gunakan hook di sini

  return (
    <nav className={styles.header__nav}>
      <Link to={{ pathname: "/", search: "" }}>
        <Pill icon={HomeIcon} text={t("home")} active={location.pathname === "/"} />
      </Link>
      <Link to={{ pathname: "/anime", search: "" }}>
        <Pill icon={AnimeIcon} text={t("anime_nav")} active={location.pathname === "/anime"} /> {/* Tambahkan kunci ini ke file terjemahan nanti */}
      </Link>
      <Link to={{ pathname: "/manga", search: "" }}>
        <Pill icon={MangaIcon} text={t("manga_nav")} active={location.pathname === "/manga"} /> {/* Tambahkan kunci ini ke file terjemahan nanti */}
      </Link>
    </nav>
  );
}

interface LanguageDropdownProps {
  currentLocale: "en" | "id" | "jp";
  changeLanguage: (lng: 'en' | 'id' | 'jp') => void;
  isDropdownOpen: boolean;
  setDropdownOpen: (state: boolean) => void;
  languages: Array<"en" | "id" | "jp">;
}

function LanguageDropdown({
  currentLocale,
  changeLanguage,
  isDropdownOpen,
  setDropdownOpen,
  languages,
}: LanguageDropdownProps) {
  const getLanguageName = (locale: "en" | "id" | "jp"): string => {
    switch (locale) {
      case "en": return "English";
      case "jp": return "Japanese";
      case "id": return "Indonesian";
      default: return "English";
    }
  };

  const dropdownContainerClass = classNames(styles.header__language_dropdown__container, {
    [styles["header__language_dropdown__container--visible"]]: isDropdownOpen,
  });

  return (
    <div
      className={styles.header__language_dropdown}
      onMouseEnter={() => setDropdownOpen(true)}
      onMouseLeave={() => setDropdownOpen(false)}
    >
      <button
        onClick={() => setDropdownOpen(!isDropdownOpen)}
        className={styles.header__actions}
        aria-label="Language selection"
      >
        <LanguageIcon size={22} color="s-color-fg-primary" />
      </button>
      <div className={dropdownContainerClass}>
        {languages.map((locale) => {
          const optionClass = classNames(styles.header__language_dropdown__option, {
            [styles["header__language_dropdown__option--active"]]: currentLocale === locale,
          });

          return (
            <div
              key={locale}
              className={optionClass}
              onClick={() => changeLanguage(locale)}
            >
              <span>{getLanguageName(locale)}</span>
              <span>({locale})</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Header() {
  const headerRef = useRef<HTMLHeadElement>(null);
  const maxHeaderWidth = useRef<number>(0);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { isDrawerOpen } = useAppSelector(state => state.appContext);
  const { changeLanguage: handleChangeLanguage, currentLanguage } = useChangeLanguage(); // Gunakan hook kita

  useEffect(() => {
    const checkOverflow = () => {
      if (headerRef.current) {
        if (headerRef.current.scrollWidth > headerRef.current.clientWidth && maxHeaderWidth.current === 0) {
          setIsOverflowing(true);
          maxHeaderWidth.current = headerRef.current.scrollWidth;
        } else if (maxHeaderWidth.current > 0 && headerRef.current.scrollWidth > maxHeaderWidth.current) {
          setIsOverflowing(false);
          maxHeaderWidth.current = 0;
        }
      }
    };
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  useEffect(() => {
    dispatch(updateIsHeaderNavHidden(isOverflowing));
  }, [dispatch, isOverflowing]);

  // Tutup dropdown jika klik di luar area
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isLanguageDropdownOpen && !target.closest(`.${styles.header__language_dropdown}`)) {
        setIsLanguageDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isLanguageDropdownOpen]);

  const handleLanguageChange = useCallback((locale: "en" | "id" | "jp") => { // Sesuaikan tipe
    handleChangeLanguage(locale); // Panggil fungsi dari hook kita
    // Jika kita ingin tetap menyimpan pilihan ke localStorage via VernacUtil
    // Kita bisa lakukan ini untuk kompatibilitas dengan bagian lain yang menggunakan VernacUtil
    if (locale === 'id') { // i18n kita menggunakan 'id', tetapi VernacUtil mungkin pakai 'in'
        VernacUtil.setCurrentLocale('in'); // Kita mapping 'id' ke 'in' untuk Vernac jika diperlukan
    } else if (locale === 'jp' || locale === 'en') {
        VernacUtil.setCurrentLocale(locale); // Langsung pakai kode yang sama
    }
  }, [handleChangeLanguage]);

  const onDrawerClick = () => {
    dispatch(updateIsDrawerOpen(!isDrawerOpen));
  };

  // Gunakan kode bahasa yang sesuai dengan i18n kita
  const languages: Array<"en" | "id" | "jp"> = ["en", "id", "jp"];

  return (
    <header className={styles.header} ref={headerRef}>
      <div className={classNames({ [styles.header__lhs]: true, "no-text-select": true })}>
        <Link to={{ pathname: "/", search: "" }}>
          <Logo />
        </Link>
        {!isOverflowing && <HeaderNav />}
      </div>
      <div className={styles.header__rhs}>
        <a href="https://github.com/bondanbanuaji/bobanimelist" target="_blank" rel="noopener noreferrer">
          <GithubIcon size={22} color="s-color-fg-primary" className={styles.header__actions} />
        </a>
        <LanguageDropdown
          currentLocale={currentLanguage as "en" | "id" | "jp"} // Gunakan state dari hook
          changeLanguage={handleLanguageChange} // Gunakan fungsi handler baru
          isDropdownOpen={isLanguageDropdownOpen}
          setDropdownOpen={setIsLanguageDropdownOpen}
          languages={languages}
        />
        <Link to={{ pathname: "/search", search: "" }}>
          <SearchIcon size={22} color="s-color-fg-primary" className={styles.header__actions} />
        </Link>
        <button onClick={onDrawerClick}>
          {isOverflowing ? (
            <MenuIcon isActive={isDrawerOpen} size={22} className={styles.header__actions} />
          ) : (
            <SettingIcon size={22} color="s-color-fg-primary" className={styles.header__actions} />
          )}
        </button>
      </div>
    </header>
  );
}

export default Header;
