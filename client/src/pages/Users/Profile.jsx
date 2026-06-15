import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import OrderHistory from "../../components/Orders/OrderHistory";

export default function UserProfile() {
  const { id } = useParams();

  const [user, setUser] = useState(null);

  const [orders, setOrders] = useState([]);

  /* =========================================================
      FETCH DATA
  ========================================================= */

  useEffect(() => {
    // USER
    fetch(`/api/users/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(
          data.users
            ? data.users[0]
            : data
        );

        console.log("Fetched user data:", data);
      })
      .catch((err) => console.error(err));

    // ORDERS
    fetch(`/api/orders/user/${id}`)
      .then((res) => res.json())
      .then(setOrders)
      .catch(console.error);

  }, [id]);

  /* =========================================================
      LOADING
  ========================================================= */

  if (!user) {
    return (
      <div
        className="
          min-h-[50vh]
          flex items-center justify-center
        "
      >
        <div className="card p-8 text-center">
          <p className="text-body-2 secondary">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
      UI
  ========================================================= */

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* =========================================================
          HERO
      ========================================================= */}

      <div
        className="
          card
          overflow-hidden
          mb-8
        "
      >
        {/* TOP COVER */}
        <div
          className="
            h-36 md:h-48
            bg-brand-secondary
            border-b border-divider-primary
          "
        />

        {/* PROFILE */}
        <div className="px-5 md:px-8 pb-8">
          {/* Avatar */}
          <div
            className="
              w-24 h-24 md:w-32 md:h-32
              rounded-full
              bg-background-default
              border-4 border-white
              shadow-card
              -mt-12 md:-mt-16
              flex items-center justify-center
              text-header-1
              brand-primary
            "
          >
            {user.username?.charAt(0).toUpperCase()}
          </div>

          {/* CONTENT */}
          <div
            className="
              flex flex-col lg:flex-row
              lg:items-end lg:justify-between
              gap-6
              mt-6
            "
          >
            {/* LEFT */}
            <div>
              <p className="text-caption tertiary uppercase mb-3">
                User Profile
              </p>

              <h1 className="dashboard-title break-words">
                {user.username}
              </h1>

              <p className="dashboard-subtitle mt-3">
                Manage your account details and track your orders.
              </p>
            </div>

            {/* ACTIONS */}
            <div
              className="
                flex flex-col sm:flex-row
                gap-3
                w-full lg:w-auto
              "
            >
              <Link
                to={`/users/${user.id}/edit`}
                className="
                  w-full sm:w-auto
                  button-primary
                  flex items-center justify-center
                "
              >
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          PROFILE GRID
      ========================================================= */}

      <div
        className="
          grid grid-cols-1
          xl:grid-cols-3
          gap-6
        "
      >
        {/* =========================================================
            LEFT COLUMN
        ========================================================= */}

        <div className="xl:col-span-1">
          <div className="card p-5 md:p-6">
            <div className="mb-6">
              <p className="text-caption tertiary uppercase mb-3">
                Account Information
              </p>

              <h2 className="text-header-3 primary">
                Details
              </h2>
            </div>

            {/* INFO */}
            <div className="space-y-5">
              {/* USERNAME */}
              <div>
                <p className="text-caption tertiary mb-2">
                  Username
                </p>

                <p className="text-label-1 primary break-all">
                  {user.username}
                </p>
              </div>

              {/* EMAIL */}
              <div>
                <p className="text-caption tertiary mb-2">
                  Email Address
                </p>

                <p className="text-body-2 secondary break-all">
                  {user.email}
                </p>
              </div>

              {/* CONTACT */}
              <div>
                <p className="text-caption tertiary mb-2">
                  Contact Number
                </p>

                <p className="text-body-2 secondary">
                  {user.contact_number || "-"}
                </p>
              </div>

              {/* ROLE */}
              <div>
                <p className="text-caption tertiary mb-2">
                  Role
                </p>

                <div
                  className="
                    inline-flex
                    items-center
                    rounded-full
                    bg-background-secondary
                    border border-divider-primary
                    px-4 py-2
                  "
                >
                  <span className="text-body-3 secondary capitalize">
                    {user.role || "customer"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            RIGHT COLUMN
        ========================================================= */}

        <div className="xl:col-span-2">
          <OrderHistory orders={orders} />
        </div>
      </div>
    </div>
  );
}