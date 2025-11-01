import { useNavigate } from "react-router";
import Image from "../../components/atoms/image";
import shocked from "../../assets/image/shocked-min.webp";
import styles from './ErrorPage.module.scss';
import Label from "../../components/atoms/label";
import { useTranslation } from 'react-i18next';
import classNames from "classnames";

interface ErrorPageProps {
    is404?: boolean;
    isRoot?: boolean;
};

function ErrorPage({ is404, isRoot }: ErrorPageProps) {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleGoHome = () => {
        navigate("/");
    };

    return (
        <div className={classNames(styles.error, { [styles['error--root']]: isRoot })}>
            <Image src={shocked} />
            <Label as='h2' font="typo-primary-xl-semibold">{is404 ? t('EP_404_TITLE') : t('EP_ERROR_TITLE')}</Label>
            <Label as='p' font="typo-primary-m-medium"> {is404 ? t('EP_404_DESC') : t('EP_ERROR_DESC')}</Label>
            <button onClick={handleGoHome}>
                <Label as='span' font="typo-primary-m-medium">{t('EP_REDIRECT_TEXT')}</Label>
            </button>
        </div>
    );
}

export default ErrorPage;