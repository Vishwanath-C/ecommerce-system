import { Button, Container, Paper, Typography } from "@mui/material";

const EmptyState = ({
                        heading = "Nothing Here",
                        message = null,
                        buttonText = null,
                        onButtonClick = null
                    }) => {
    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    borderRadius: 3,
                    textAlign: "center",
                    backgroundColor: "#f9fafb",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                }}
            >
                {/* Heading */}
                <Typography variant="h5" fontWeight="bold">
                    {heading}
                </Typography>

                {/* Optional Message */}
                {message && (
                    <Typography variant="body1" color="text.secondary">
                        {message}
                    </Typography>
                )}

                {/* Optional Button */}
                {buttonText && onButtonClick && (
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2, borderRadius: 2 }}
                        onClick={onButtonClick}
                    >
                        {buttonText}
                    </Button>
                )}
            </Paper>
        </Container>
    );
};

export default EmptyState;
