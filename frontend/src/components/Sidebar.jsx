import {
    Box,
    Typography,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
} from "@mui/material";
import {useNavigate, useLocation} from "react-router-dom";
import {
    Home,
    AccountCircle,
    ReceiptLong,
    Category,
    Settings,
    AddShoppingCart,
    ExpandLess,
    ExpandMore,
} from "@mui/icons-material";
import {useEffect, useState} from "react";
import apiClient from "../api.js";

const Sidebar = ({isMenuOpen, setActivePage, fetchProducts, fetchProductsByCategory}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem("token");
    const [categories, setCategories] = useState([]);

    const [openCategoryMenu, setOpenCategoryMenu] = useState(false);
    const [openCategoryActionsMenu, setOpenCategoryActionsMenu] = useState(false);
    const [openProductsMenu, setOpenProductsMenu] = useState(false);

    const [activeItem, setActiveItem] = useState(""); // track active menu/child
    const role = localStorage.getItem("role");

    if (!isMenuOpen) return null;

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await apiClient.get("/categories", {
                    headers: {Authorization: `Bearer ${token}`},
                });
                setCategories(res.data);
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        console.log()
    });

    const handleCategoryClick = () => {
        setOpenCategoryMenu((prev) => !prev);
        console.log("Category menu clicked ", openCategoryMenu);
    };

    const handleCategoryActionsClick = () => {
        setOpenCategoryActionsMenu((prev) => !prev);
        console.log("Category actionsClicked ", openCategoryActionsMenu);
    };

    const handleProductsClick = () => {
        setOpenProductsMenu((prev) => !prev);
        console.log("Products clicked ", openProductsMenu);
    };

    // const handleCategoryClick = () => setOpenCategoryMenu((prev) => !prev);
    // const handleCategoryActionsClick = () => setOpenCategoryActionsMenu((prev) => !prev);
    // const handleProductsClick = () => setOpenProductsMenu((prev) => !prev);

    const commonItems = [
        {
            label: "Home",
            icon: <Home/>,
            action: () => {
                setActiveItem("Home");
                fetchProducts();
                navigate("/app/home");
            },
        },
        {
            label: "Profile",
            icon: <AccountCircle/>,
            action: () => {
                setActiveItem("Profile");
                setActivePage("profile");
            },
        },

        {
            label: "Category",
            icon: <Category/>,
            action: handleCategoryClick,
            children: categories.map((cat) => ({
                label: cat.name,
                action: () => {
                    setActiveItem(cat.name);
                    fetchProductsByCategory(cat.id);
                },
            })),
        },
        {
            label: "Settings",
            icon: <Settings/>,
            action: () => {
                setActiveItem("Settings");
                setActivePage("settings");
            },
        },
    ];

    const userItems = [
        {
            label: "Orders",
            icon: <ReceiptLong/>,
            action: () => {
                setActiveItem("Orders");
                navigate("/app/user-orders");
            },
        },
    ]

    // 🔹 Admin only
    const adminItems = [
        {
            label: "Orders",
            icon: <ReceiptLong/>,
            action: () => {
                setActiveItem("Orders");
                navigate("/app/user-orders-admin");
            },
        },
        {
            label: "Category Actions",
            icon: <Category/>,
            action: handleCategoryActionsClick,
            children: [
                {
                    label: "Add Category",
                    action: () => {
                        setActiveItem("Add Category");
                        navigate("/app/add-category");
                    },
                },
                // {
                //     label: "Update Category",
                //     action: () => {
                //         setActiveItem("Update Category");
                //         navigate("/app/update-category");
                //     },
                // },
            ]
        },
        {
            label: "Product Actions",
            icon: <AddShoppingCart/>,
            action: handleProductsClick,
            children: [
                {
                    label: "Add Product",
                    action: () => {
                        setActiveItem("Add Product");
                        navigate("/app/add-product");
                    },
                },
                {
                    label: "Update Product",
                    action: () => {
                        setActiveItem("Update Product");
                        navigate("/app/update-product");
                    },
                },
            ],
        },
    ];

    const menuMap = {
        ADMIN: [...commonItems, ...adminItems],
        CUSTOMER: [...commonItems, ...userItems],
    };

    const openMenuMap = {
        "Category": openCategoryMenu,
        "Category Actions": openCategoryActionsMenu,
        "Product Actions": openProductsMenu,
    };


    const menuItems = menuMap[role] || commonItems;

    return (
        <Box
            sx={{
                position: "fixed",
                top: "70px",
                left: 0,
                bottom: "70px",
                width: 200,
                height: "calc(100vh - 70px)",
                bgcolor: "#f5f5f5",
                boxShadow: "2px 0 4px rgba(0,0,0,0.1)",
                p: 2,
                zIndex: 1200
            }}
        >
            <Typography variant="h6" sx={{mb: 2, fontWeight: "bold"}}>Menu</Typography>
            <Box sx={{
                overflowY: "auto", maxHeight: "calc(100vh - 120px)",
                scrollbarWidth: "thin",
                "&::-webkit-scrollbar": {width: "6px"},
                "&::-webkit-scrollbar-thumb": {backgroundColor: "rgba(0,0,0,0.2)", borderRadius: "3px"},
            }}>
                <List>
                    {menuItems.map((item) => {
                        // Expandable items
                        if (item.children) {
                            // const isOpen = item.label === "Category" ? openCategoryMenu : ("CategoryActions" ? openCategoryActionsMenu: openProductsMenu);

                            const isOpen = openMenuMap[item.label];

                            return (
                                <Box key={item.label}>
                                    <ListItemButton
                                        onClick={item.action}
                                        sx={{
                                            borderRadius: 1,
                                            mb: 0.5,
                                            py: 0.4,
                                            minHeight: 36,
                                            bgcolor: isOpen ? "primary.main" : "transparent",
                                            color: isOpen ? "white" : "text.primary",
                                            "&:hover": {bgcolor: isOpen ? "primary.dark" : "rgba(0,0,0,0.05)"},
                                            transition: "0.2s ease",
                                        }}
                                    >
                                        <ListItemIcon sx={{color: isOpen ? "white" : "text.primary", minWidth: 40}}>
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={item.label}
                                            slotProps={{
                                                primary: {sx: {fontSize: "0.85rem", fontWeight: "bold"}},
                                            }}
                                        />

                                        {isOpen ? <ExpandLess/> : <ExpandMore/>}
                                    </ListItemButton>
                                    <Collapse in={isOpen} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {item.children.map((child) => {
                                                const isActive = activeItem === child.label;

                                                return (
                                                    <ListItemButton
                                                        key={child.label}
                                                        sx={{
                                                            pl: 8,
                                                            borderRadius: 1,
                                                            mb: 0.3,
                                                            bgcolor: isActive
                                                                ? "primary.light"         // selected item
                                                                : "grey.100",             // default light shade
                                                            color: isActive ? "primary.contrastText" : "text.primary",
                                                            "&:hover": {
                                                                bgcolor: isActive ? "primary.main" : "grey.200", // slightly darker on hover
                                                            },
                                                            transition: "0.2s ease",
                                                        }}
                                                        onClick={child.action}
                                                    >
                                                        <ListItemText
                                                            primary={child.label}
                                                            slotProps={{
                                                                primary: {sx: {fontSize: "0.85rem", fontWeight: 500}},
                                                            }}
                                                        />
                                                    </ListItemButton>
                                                );
                                            })}
                                        </List>
                                    </Collapse>


                                </Box>
                            );
                        }

                        // Default menu items
                        return (
                            <ListItemButton
                                key={item.label}
                                onClick={item.action}
                                sx={{
                                    borderRadius: 1,
                                    mb: 1,
                                    bgcolor: activeItem === item.label ? "primary.main" : "transparent",
                                    color: activeItem === item.label ? "white" : "text.primary",
                                    "&:hover": {bgcolor: activeItem === item.label ? "primary.dark" : "rgba(0,0,0,0.05)"},
                                    transition: "0.2s ease",
                                }}
                            >
                                <ListItemIcon
                                    sx={{color: activeItem === item.label ? "white" : "text.primary", minWidth: 40}}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.label}
                                              slotProps={{primary: {sx: {fontSize: "0.85rem", fontWeight: "bold"}},}}/>
                            </ListItemButton>
                        );
                    })}
                </List>
            </Box>
        </Box>
    );
};

export default Sidebar;
