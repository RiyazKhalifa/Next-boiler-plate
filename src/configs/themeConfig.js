import i18n from "i18next";

const themeConfig = {
    templateName: i18n.t("excellent_web_world"),
    homePageUrl: "/dashboard",
    settingsCookieName: "excellent-web-world",
    mode: "light",
    skin: "default",
    semiDark: false,
    layout: "vertical",
    layoutPadding: 24,
    compactContentWidth: 1440,
    navbar: {
        type: "fixed",
        contentWidth: "compact",
        floating: true,
        detached: true,
        blur: true,
    },
    contentWidth: "compact",
    footer: {
        type: "static",
        contentWidth: "compact",
        detached: true,
    },
    disableRipple: false,
};

export default themeConfig;
