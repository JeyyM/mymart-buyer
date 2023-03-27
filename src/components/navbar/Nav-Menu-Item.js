import { Fragment } from "react";
import Link from "next/link"
import { useRouter } from "next/router"

function NavMenuItem(props) {
  const router = useRouter()

  return (
    <Link href={{pathname: `/${router.query.shopid}/${props.link}`, query: { shopid: router.query.shopid },}} style={{ textDecoration: 'none' }}>
      <button className="navmenu-item">
        <div className={`menu-${props.logo}`}>&nbsp;</div>
        <h2 className="heading-secondary">{props.label}</h2>
      </button>
      </Link>
  );
}

export default NavMenuItem;
