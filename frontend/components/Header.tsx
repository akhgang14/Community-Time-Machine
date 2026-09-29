export default function Header() {
  return (
    <header className="header">
      <div>
        <p className="header-eyebrow">MODERATOR DASHBOARD</p>
        <h2>Community Intelligence</h2>
      </div>

      <div className="header-user">
        <div className="avatar">M</div>

        <div>
          <p className="user-name">Moderator</p>
          <p className="user-role">Community Admin</p>
        </div>
      </div>
    </header>
  );
}