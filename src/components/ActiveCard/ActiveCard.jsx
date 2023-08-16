/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-irregular-whitespace */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
// import "./ActiveCard.scss";
// import CardLikeIcon from "@images/card-like-icon.svg";
import CardULikeIcon from "@images/card-ulike-icon.svg";
// import mockCardImg from "@images/mock-img.png";
import AnnounService from "../../Api/announ.service";
import { CardSkeleton } from "@components/Cards/CardSkeleton";
import noData from "@images/no-data.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Switch } from "antd";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "@/Api/api";
import cardService from "@/Api/card.service.jsx";
import { useTranslation } from "react-i18next";

export const ActiveCard = () => {
  const { t, i18n } = useTranslation();

  const [activeCard, setActiveCard] = useState({
    isLoading: true,
    data: [],
  });

  const [check, setCheck] = useState(true);
  const checkInput = useRef();

  const getActives = async () => {
    const token = localStorage.getItem("token");

    const data = await AnnounService.getActiveCard(token);
    console.log(data);
    if (data.status == 200) {
      setActiveCard({
        isLoading: false,
        data: data?.data,
      });
    }
  };

  useEffect(() => {
    getActives();
  }, []);

  const newData = activeCard?.data?.posts;
  const mockData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const handleChange = async (evt) => {
    let id = evt.target.id;
    console.log(evt.target.checked);

    try {
      const token = localStorage.getItem("token");
      const data = await AnnounService.setActiveCard(id, token);
      if (data.status === 200) {
        toast.success(`${t("announ.errannoun")}`);
      }
      getActives();

      console.log(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const navigate = useNavigate();
  const handleClick = async (evt) => {
    const slug = evt.target.name;
    const id = evt.target.id;
    // const slug = evt.target
    const targetTag = evt.target.className;

    const token = localStorage.getItem("token") || "";

    if (!token) {
      navigate("/register");
    }

    if (targetTag != "de_active__btn") {
      if (targetTag === "card__like" || targetTag === "card__like-img") {
        const response = await cardService.likeCard(id);
        console.log("like: ", response);
      } else {
        window.scroll(0, 0);
        navigate(`/announcement/${slug}`);
      }
    }
  };

  return (
    <>
      <div className="active__card">
        <ul className="card-list">
          {activeCard.isLoading ? (
            mockData.map((moc) => <CardSkeleton key={moc} />)
          ) : newData?.length ? (
            newData?.map((item) => (
              <>
                <li
                  name={item.slug}
                  id={item.announcement_id}
                  onClick={handleClick}
                  className="card"
                >
                  <img
                    name={item.slug}
                    id={item.announcement_id}
                    className="card__img mb-3"
                    src={BASE_URL + item?.thumb[0]}
                    height={222}
                  />
                  <div
                    name={item.slug}
                    id={item.announcement_id}
                    className="card__wrap"
                  >
                    <div
                      name={item.slug}
                      id={item.announcement_id}
                      className="card__inner"
                    >
                      <span
                        name={item.slug}
                        id={item.announcement_id}
                        className="card__city"
                      >
                        {item.city}
                      </span>
                      <div
                        name={item.slug}
                        id={item.announcement_id}
                        className="card__right"
                      >
                        <span
                          name={item.slug}
                          id={item.announcement_id}
                          className="card__view me-2"
                        >
                          {item.viewCount}
                        </span>
                        <button
                          name={item.slug}
                          id={item.announcement_id}
                          className="card__like"
                        >
                          <img
                            className="card__like-img"
                            src={CardULikeIcon}
                            width={17}
                            height={16}
                            alt="Card like button image"
                          />
                        </button>
                        <span
                          name={item.slug}
                          id={item.announcement_id}
                          className="me-1"
                          style={{
                            fontSize: "12px",
                            color: "#666666",
                            lineHeight: "14px",
                          }}
                        >
                          {" "}
                          {item?.likeCount}
                        </span>
                      </div>
                    </div>
                    <h3
                      name={item.slug}
                      id={item.announcement_id}
                      className="card__body"
                    >
                      {item.description?.substring(0, 60)}...
                    </h3>
                    <button
                      onClick={handleChange}
                      id={item.announcement_id}
                      className="de_active__btn"
                    >
                      {t("announ.deactiveannoun")}
                    </button>
                    <p className="m-0">
                      {item?.district},{" "}
                      {item?.createdAt.toString().slice(0, 10)}
                    </p>
                    <p
                      name={item.slug}
                      id={item.announcement_id}
                      className="de_card__price"
                    >
                      {item.price
                        .toString()
                        .replace(
                          /(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g,
                          "$1 "
                        )}{" "}
                      {item.price_type == "sum" ? "so'm" : "$"}
                    </p>
                  </div>
                </li>
              </>
            ))
          ) : (
            <img className="img-fluid" width={500} src={noData} />
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
    </>
  );
};
