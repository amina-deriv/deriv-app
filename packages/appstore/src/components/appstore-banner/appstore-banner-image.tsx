import React from 'react';
import SVGMigrateDesktopImage from 'Assets/svgs/banner/svg-migrate-desktop.svg';
import SVGMigrateMobileImage from 'Assets/svgs/banner/svg-migrate-mobile.svg';

export type TBannerImageProps<T> = {
    image: T;
    className?: string;
    width?: number;
};

type TAppstoreBannerImageListProps = keyof typeof AppstoreBannerImageList;

const AppstoreBannerImageList = {
    svg_migrate_desktop: SVGMigrateDesktopImage,
    svg_migrate_mobile: SVGMigrateMobileImage,
};

const AppstoreBannerImage = ({ image, className, width }: TBannerImageProps<TAppstoreBannerImageListProps>) => {
    const Component = AppstoreBannerImageList[image] as React.ElementType;
    const data_testid = `dt_${image}`;

    return <Component className={className} style={{ width }} data-testid={data_testid} />;
};

export default AppstoreBannerImage;
