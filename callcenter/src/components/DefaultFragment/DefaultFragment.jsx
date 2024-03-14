import LeftSideNavBar from "../LeftSideNavBar/LeftSideNavBar";

const DefaultFragment = ({ children }) => {
    return (
        <div>
            <LeftSideNavBar />
            {children}
        </div>
    )
}

export default DefaultFragment