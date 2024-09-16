import useLocalize from '../hooks/use-localize';

const PageNotFound = () => {
    const { localize } = useLocalize();

    return (
        <div className="PageNotFound">
            <h1>{localize('pageNotFound')}</h1>
        </div>
    );
};

export default PageNotFound;
