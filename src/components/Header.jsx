import logo from '../logo.png'; // Подключаем изображение логотипа
const Header = () =>{
    return (
        <>
            <div className="HeaderText" style={{left: '252px', top: '36px'}}>
                ТЕОРИЯ АВТОМАТИЧЕСКОГО УПРАВЛЕНИЯ
            </div>
            <div className="HeaderText" style={{ left: '261px', top: '132px', fontSize: 32}}>
                САЙТ ПОМОЩНИК ДЛЯ СТУДЕНТОВ
            </div>
            <div className="LogoContainer">
                <img src={logo} alt="Логотип" className="Logo" />
            </div>
        </>
    )
};
export default Header;