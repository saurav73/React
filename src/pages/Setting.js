const Setting = () => {
  return (
    <div>
      <h2>Setting</h2>
      <p>Welcome to the Setting Page</p>
      <div>
        <label>users Information</label>
        <input type="text" placeholder="Name" />
        <input type="text" placeholder="Email" />
        <input type="text" placeholder="Phone" />
        <input type="text" placeholder="Address" />
        <button className="button-add">Update</button>
      </div>
    </div>
  );
};

export default Setting;
