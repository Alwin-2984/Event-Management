// Importing required components and modules
import footerCss from "./Footer.module.css";

export default function footer() {
  // Get email from localstorage to diplay in footer
  const email = localStorage.getItem("email");

  return (
    <div className={footerCss.topbarContainer}>
      <div className={footerCss.topbarLeft}>
        <span className={footerCss.logo}>{email}</span>
      </div>
      <div className={footerCss.topbarCenter}></div>
      <div className={footerCss.topbarRight}>
        <div className={footerCss.topbarLinks}></div>
        <div className={footerCss.topbarIcons}></div>
      </div>
    </div>
  );
}
