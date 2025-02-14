const Header = () => {
  return (
    <div className="v-row header">
      <div className="v-col header__logo">
        <h1>Admin <img width="48" height="48" src="https://img.icons8.com/color/48/portal.png" alt="portal"/></h1>
      </div>
      <div className="v-col header__search">
        <div className="search-container">
          <img src="https://img.icons8.com/ios-filled/24/search.png" alt="search icon" className="search-icon" />
          <input type="text" placeholder="Search..." className="search-bar" />
        </div>
      </div>
    </div>
  );
};

export default Header;
