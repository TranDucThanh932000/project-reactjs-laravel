import { Card, Grid, Stack, Skeleton } from "@mui/material";

const SkeletonBlog = () => {
  return (
    Array.from({ length: 18 }, (_, index) => (
      <Grid item xs={12} key={index}>
        <Stack>
          <Card sx={{ minWidth: 100, maxWidth: 300 }}>
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="rectangular" width={100} height={80} />
            <Skeleton variant="rounded" width={100} height={60} />
          </Card>
        </Stack>
      </Grid>
    ))
  )
};

export default SkeletonBlog;
