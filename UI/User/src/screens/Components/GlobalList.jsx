import FavoriteIcon from "@mui/icons-material/Favorite";
import style from "./Dashboard/Dashboard.module.css";
import StarRating from "./StarRating";
import { NavLink } from "react-router-dom";

export function GlobalList(movieList, isSpeaker, isHome, isSponsor, isBooth) {
  const speakerCss = "relative w-32 max-md:max-w-[160px]";
  const homeListCss = "relative w-60 max-md:max-w-[150px] max-lg:max-w-[180px]";
  const sponsorCss = "relative w-28 max-md:max-w-[160px]";
  const boothCss = "relative w-28 max-md:max-w-[160px]";
  const cardStyles = `${
    isBooth ? style.cardBooth : style.card
  } max-md:max-h-[215px]`;
  const cardImgStyles = `${style.cardImg} max-md:max-h-[220px]`;

  return movieList.map((event, key) => {
    const eventImageSrc = `${event.EventImage}${key}`;
    let classNames = "";

    if (isSpeaker) {
      classNames += speakerCss;
    } else if (isHome) {
      classNames += homeListCss;
    } else if (isSponsor) {
      classNames += sponsorCss;
    } else if (isBooth) {
      classNames += boothCss;
    }

    const likeColor = event.LikeStatus ? "error" : "info";

    const cardContent = (
      <div className={cardStyles}>
        {isHome ? (
          <NavLink to="/dashboard/eventDetailedView">
            <img src={eventImageSrc} className={cardImgStyles} alt="" />
          </NavLink>
        ) : (
          <img
            src={eventImageSrc}
            className="w-full h-auto object-cover bg-cover max-md:max-h-[180px]"
            alt=""
            loading="lazy"
          />
        )}

        {isHome && (
          <div className="card-body">
            <FavoriteIcon color={likeColor} />
            <StarRating />
          </div>
        )}
      </div>
    );

    return (
      <div key={event.id} className="flex ">
        <div className={classNames}>
          {cardContent}
          <h3 className="h-5 mt-2">{event.EventName}</h3>
          {isHome && <p className="detail">{event.EventCategory}</p>}
        </div>
      </div>
    );
  });
}
