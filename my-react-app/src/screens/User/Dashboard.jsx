import style from "./Dashboard.module.css";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MenuIcon from "@mui/icons-material/Menu";
import FavoriteIcon from '@mui/icons-material/Favorite';
import "./navbar.css";
const Dashboard = () => {
  return (
    <div className={`${style.mainWrapper}`}>
      <div>
        {" "}
        <nav className={style.navbar}>
        <a href="#" className="btn-customized open-menu">
              <MenuIcon />
            </a>
          <img
            src="src/assets/11zon_cropped (3).png"
            className="brand-logo"
            alt=""
          />
          <div className="input">
            <SearchIcon />
            <input
              className="search"
              placeholder="Search for Movies, Events, Plays, Sports, and Activities"
            ></input>
          </div>
          <div className="right-container">
            <a href="#" className="location">
              Kollam
              <ArrowDropDownIcon />
            </a>
            <button
              className="signin"
              
            >
              Signin
            </button>

           
          </div>
        </nav>
      </div>

      <div>
        <nav className="subnavbar">
          <ul className="navitem">
            <li>
              <a href="#Movies">Autoshow</a>
            </li>
            <li>
              <a href="#Movies">Sports</a>
            </li>
            <li>
              <a href="#Movies">Magic</a>
            </li>
            <li>
              <a href="#Movies">Esports</a>
            </li>
            <li>
              <a href="#Movies">Fitness</a>
            </li>
          </ul>
        </nav>
        <h1 className="title">Recommended Events</h1>
            <div className="movies-list">
                <div className="card-container">

                    <div className="movie">
                        <div className="card">
                            <img src="src/assets/Photos/3D_Wallpaper_Backgrounds6_UfNf55C.jpg" className="card-img" alt=""/>
                            <div className="card-body">
                                <FavoriteIcon color="error"/>
                                {/* <ion-icon name="heart-sharp"></ion-icon> */}
                                <p>93% & 928 votes</p>
                            </div>
                        </div>
                        <h3>Theerppu</h3>
                        <p className="detail">Drama/Thriller</p>
                    </div>

                    <div className="movie">
                        <div className="card">
                            <img src="src/assets/Photos/2011_thor_movie-1366x768.jpg" className="card-img" alt=""/>
                            <div className="card-body">
                            <FavoriteIcon color="success"/>

                                {/* <ion-icon name="heart-sharp"></ion-icon> */}
                                <p>92% &ThinSpace; 16k votes</p>
                            </div>
                        </div>
                        <h3>Thallumaala</h3>
                        <p className="detail">Action/Comedey</p>
                    </div>

                    <div className="movie">
                        <div className="card">
                            <img src="src/assets/Photos/1294149955-GMP7S85.jpg" className="card-img" alt=""/>
                            <div className="card-body">
                            <FavoriteIcon/>

                                {/* <ion-icon name="heart-sharp"></ion-icon> */}
                                <p>94% &ThinSpace; 14k votes</p>
                            </div>
                        </div>
                        <h3>Nna Thaan Case Kodu</h3>
                        <p className="detail">Comedy/Drama</p>
                    </div>

                    <div className="movie">
                        <div className="card">
                            <img src="src/assets/Photos/assassins_creed_game-1366x768.jpg" className="card-img" alt=""/>
                            <div className="card-body">
                            <FavoriteIcon/>

                                {/* <ion-icon name="heart-sharp"></ion-icon> */}
                                <p>59% &ThinSpace; 74k votes</p>
                            </div>
                        </div>
                        <h3>Liger</h3>
                        <p className="detail">Action/Drama/Romantic</p>
                    </div>

                    <div className="movie">
                        <div className="card">
                            <img src="src/assets/Photos/1179155934_1024x768_spider-man-in-rain-wallpaper.jpg" className="card-img" alt=""/>
                            <div className="card-body">
                            <FavoriteIcon/>

                                {/* <ion-icon name="heart-sharp"></ion-icon> */}
                                <p>87% &ThinSpace; 34k votes</p>
                            </div>
                        </div>
                        <h3>Thiruchitrambalam</h3>
                        <p className="detail">Comedy/Drama/Musical</p>
                    </div>

                    <div className="movie">
                        <div className="card">
                            <img src="src/assets/Photos/abstract-lion-1366x768.jpg" className="card-img" alt=""/>
                            <div className="card-body">
                            <FavoriteIcon/>

                                {/* <ion-icon name="heart-sharp"></ion-icon> */}
                                <p>92% &ThinSpace; 120k votes</p>
                            </div>
                        </div>
                        <h3>Sita Ramam</h3>
                        <p className="detail">Action/Drama/Romantic</p>
                    </div>

                    <div className="movie">
                        <div className="card">
                            <img src="src/assets/Photos/24.jpg" className="card-img" alt=""/>
                            <div className="card-body">
                            <FavoriteIcon/>

                                {/* <ion-icon name="thumbs-up-sharp" style="color: green;"></ion-icon> */}
                                <p>3k likes</p>
                            </div>
                        </div>
                        <h3>Kudukka 2025</h3>
                        <p className="detail">Drama/Thriller</p>
                    </div>

                    <div className="movie">
                        <div className="card">
                            <img src="src/assets/Photos/32.jpg" className="card-img" alt=""/>
                            <div className="card-body">
                            <FavoriteIcon/>

                                <p>84% &ThinSpace; 226 votes</p>
                            </div>
                        </div>
                        <h3>Peace</h3>
                        <p className="detail">Comedy/Drama/Thriller</p>
                    </div>

                    <div className="movie">
                        <div className="card">
                            <img src="src/assets/Photos/22.jpg" className="card-img" alt=""/>
                            <div className="card-body">
                            <FavoriteIcon color="error"/>

                                {/* <ion-icon name="thumbs-up-sharp" style="color: green;"></ion-icon> */}
                                <p>111 likes</p>
                            </div>
                        </div>
                        <h3>Beyond The 7 Seas</h3>
                        <p className="detail">Drama/Fantasy/Thriller</p>
                    </div>

                </div>
            </div>

       

            <h1 className="title-enter">The Best of Entertainment</h1>
            <div className="enter-list">
                <div className="enter-container">

                    <div className="card">
                        <img src="src/assets/Photos/11.jpg" className="card-img" alt=""/>
                    </div>

                    <div className="card">
                        <img src="img/enter/enter2.webp" className="card-img" alt=""/>
                    </div>

                    <div className="card">
                        <img src="img/enter/enter3.webp" className="card-img" alt=""/>
                    </div>

                    <div className="card">
                        <img src="img/enter/enter4.webp" className="card-img" alt=""/>
                    </div>

                    <div className="card">
                        <img src="img/enter/enter5.webp" className="card-img" alt=""/>
                    </div>

                    <div className="card">
                        <img src="img/enter/enter6.webp" className="card-img" alt=""/>
                    </div>

                    <div className="card">
                        <img src="img/enter/enter7.webp" className="card-img" alt=""/>
                    </div>

                    <div className="card">
                        <img src="img/enter/enter8.webp" className="card-img" alt=""/>
                    </div>

                    <div className="card">
                        <img src="img/enter/enter9.webp" className="card-img" alt=""/>
                    </div>

                    <div className="card">
                        <img src="img/enter/enter10.webp" className="card-img" alt=""/>
                    </div>

                    <div className="card">
                        <img src="img/enter/enter11.webp" className="card-img" alt=""/>
                    </div>

                    <div className="card">
                        <img src="img/enter/enter12.webp" className="card-img" alt=""/>
                    </div>

                </div>
            </div>

      </div>
      
        </div>

  );
};

export default Dashboard;
