export const calcAvgRating = async (product) => {
    try {
        const totalRatings = product.ratings.length;
        let totalRating = 0;

        if (totalRatings > 0) {
            product.ratings.forEach((rating) => {
                totalRating += rating.rating;
            });

            const avgRating = totalRating / totalRatings;
            return avgRating;
        } else {
            return 0; 
        }
    } catch (error) {
        console.error("Error calculating average rating:", error.message);
        throw error;
    }
};