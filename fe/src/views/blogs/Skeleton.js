import { Card, Grid, Stack, Skeleton } from "@mui/material";

const SkeletonBlog = () => {
  return Array.from({ length: 9 }, (_, index) => (
    <Grid item xs={12} sm={6} md={4} key={index}>
      <Stack spacing={1}>
        <Card sx={{ maxWidth: "100%" }}>
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="rectangular" width={210} height={100} />
          <Skeleton variant="rounded" width={210} height={60} />
        </Card>
      </Stack>
    </Grid>
  ));
};

export default SkeletonBlog;