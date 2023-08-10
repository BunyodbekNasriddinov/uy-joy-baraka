/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import "./Favorite.scss";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import noData from "@images/no-data.svg";
import AnnounService from "../../Api/announ.service";
import cardService from "@/Api/card.service.jsx";
import { CardSkeleton } from "@components/Cards/CardSkeleton";
import { BASE_URL } from "@/Api/api";
import CardLikeIcon from "@images/card-like-icon.svg";
import CardULikeIcon from "@images/card-ulike-icon.svg";
import { BackButton } from "../../components/BackButton/BackButton";
import SearchService from "../../Api/search.service";
import { useSelector } from "react-redux";
import CardService from "../../Api/card.service";
import "react-toastify/dist/ReactToastify.css";
import InfiniteScroll from "react-infinite-scroll-component"

export const Favorite = () => {
  const [likeImgSrc, setLikeImgSrc] = useState(CardULikeIcon);

  const [activeCard, setActiveCard] = useState({
    isLoading: true,
    data: [],
  });

  const getSearchCard = async () => {
    const data = await CardService.getLike();
    console.log(data);
    if (data?.status === 200) {
      setLikeImgSrc(CardLikeIcon);
      setActiveCard({
        isLoading: false,
        data: data.data,
      });
    }
  };

  useEffect(() => {
    getSearchCard();
  }, []);

  const [count, setCount] = useState();
  const newData = activeCard?.data?.posts;
  const mappedData = newData?.map((item) => ({
    likeId: item.like_id,

    userId: item.user_id,

    announcementId: item.announcement_id,

    date: item.date,

    createdAt: item.createdAt,

    updatedAt: item.updatedAt,

    announcement: {
      address: item["announcement.address"],

      city: item["announcement.city"],
      slug: item["announcement.slug"],

      district: item["announcement.district"],

      type: item["announcement.type"],

      description: item["announcement.description"],

      price: item["announcement.price"],

      priceType: item["announcement.price_type"],
      phone: item["announcement.phone"],

      status: item["announcement.status"],

      confirm: item["announcement.confirm"],

      likeCount: item["announcement.likeCount"],
      viewCount: item["announcement.viewCount"],
      rec: item["announcement.rec"],
      fullName: item["announcement.full_name"],

      avatar: item["announcement.avatar"],

      thumb: item["announcement.thumb"],

      title: item["announcement.title"],

      user_id: item["announcement.user_id"],
      createdAt: item["announcement.createdAt"],

      updatedAt: item["announcement.updatedAt"],
    },
  }));

  const mockData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const navigate = useNavigate();

  const handleClick = async (event) => {
    event.preventDefault();
    const targetElement = event.target.closest(".card__like");

    if (targetElement) {
      const data = await CardService.unLikeCard(event.target.id);
      toast.success("Saqlanganlardan chiqarildi");

      console.log(data);
      getSearchCard();
      event.preventDefault();
      return data
    }
  };

  return (
    <div className="container">
      <div style={{ paddingTop: "90px" }}>
        <h3 className="heart__title">Saqlanganlar</h3>
        <hr />
        <h3 className="heart__desc mb-2">
          {mappedData?.length ? <>{activeCard?.data?.totalCount} ta e'lon topildi</> : ''}
        </h3>{" "}
        <ul className="card-list pt-3 mb-3">
          {
          activeCard.isLoading ? (
            mockData.map((moc) => <CardSkeleton key={moc} />)
          ) : mappedData?.length ? (
            mappedData?.map((card) => (
              <>
                <Link
                key={card.announcementId}
                  to={`/announcement/${card.announcement?.slug}`}
                  onClick={handleClick}
                  className="card"
                >
                  <img
                    className="card__img"
                    src={BASE_URL + card.announcement?.thumb[0]}
                    height={222}
                    alt={card.announcement?.district}
                  />
                  <div className="card__wrap">
                    <div className="card__inner">
                      <span className="card__city">
                        {card.announcement?.city
                          ? card.announcement?.city
                          : "Kiritilmagan"}
                      </span>
                      <div className="card__right">
                        <span className="card__view me-2">
                          {card.announcement?.viewCount}
                        </span>
                        <button className="card__like">
                          <img
                            id={card.announcementId}
                            className="card__like-img"
                            src={likeImgSrc}
                            width={17}
                            height={16}
                            alt="Card like button image"
                          />
                        </button>
                      </div>
                    </div>
                    <h3 className="card__body">
                      {card.announcement?.description?.substring(0, 45)}...
                    </h3>
                    <p className="card__price">
                      {card.announcement?.price
                        .toString()
                        .replace(
                          /(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g,
                          "$1 "
                        )}{" "}
                      {card.announcement?.price_type === "dollar"
                        ? "$"
                        : "s'om"}
                    </p>
                  </div>
                </Link>
              </>
            ))
          ) : (
            <div className="py-5 d-flex flex-column align-items-center">
              <p>
                <span className="favorite__desc">
                  Hozircha yoqtirgan e'lonlaringiz mavjud emas!
                </span>{" "}
              </p>
            </div>
          )}
        </ul>
        <ToastContainer
          position="bottom-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </div>
  );
};
