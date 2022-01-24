export default function Footer(){
    const currentYear = new Date().getFullYear();
    return(
        <>
        <footer className="footer-wrap">
            <div className="container-fluid">
                <div className="row align-items-center">
                    <div className="col-md-4 order-2 text-right">
                        <ul className="footer-menu">
                            <li>
                                <a href="#">Privacy Policy</a>
                            </li>
                            <li>
                                <a href="#">Terms</a>
                            </li>
                            <li>
                                <a href="#">Contact</a>
                            </li>
                        </ul>
                    </div>
                    <div className="col-md-8">
                        <div className="copyright">&copy; {currentYear} Greenlight Automotive Solutions™  LLC ALL RIGHT RESERVED</div>
                    </div>
                </div>
            </div>
        </footer>
        </>
    )
}