import { CommentStatus, PostStatus } from "../../../generated/prisma/enums"
import { PostWhereInput } from "../../../generated/prisma/models"

import { prisma } from "../../lib/prisma"
import { ICreatePostPayload, IPostQuery, IUpdatePostPayload } from "./post.interface"

const createPost = async (payload: ICreatePostPayload, userId: string) => {
    const result = await prisma.post.create({
        data: {
            ...payload,
            authorId: userId
        }
    })

    return result
}


const getAllPosts = async (query: IPostQuery) => {
    const limit = query.limit ? Number(query.limit) : 10;
    const page = query.page ? Number(query.page) : 1;
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy ? query.sortBy : 'createdAt';
    
    
    const sortOrder = query.sortOrder ? query.sortOrder : 'desc';

     const tags=query.tags?JSON.parse(query.tags as string):null;
     const tagsArray=Array.isArray(tags) ? tags:[]

    const andConditions: PostWhereInput[] = [];
    
    if (query.searchTerm) {
        andConditions.push({
            OR: [
                {
                    title: {
                        contains: query.searchTerm,
                        mode: 'insensitive'
                    }
                },
                {
                    content: {
                        contains: query.searchTerm,
                        mode: 'insensitive'
                    }
                }
            ]
        });
    }
    
    if (query.title) {
        andConditions.push({
            title: query.title
        });
    }
    
    if (query.content) {
        andConditions.push({
            content: query.content
        });
    }
    
    if (query.authorId) {
        andConditions.push({
            authorId: query.authorId
        });  
    }
    
    if (query.isFeatured) {
        andConditions.push({
            isFeatured: Boolean(query.isFeatured)
        });
    }
    
    if (query.tags) {
        andConditions.push({
            tags: {
                hasSome: tagsArray
            }
        });
    }
    
    if (query.status) {
        andConditions.push({
            status: query.status
        });
    }
    
    const posts = await prisma.post.findMany({
        /* =========================================================
           ✨ ফিচার ১: হুবহু ম্যাচিং ফিল্টারিং (Filtering or Exact Match)
           ========================================================= */
        // where: {
        //     title: 'My First Post',
        //     content: 'Rolando'
        // },

        /* =========================================================
           ✨ ফিচার ২: অ্যান্ড অপারেটর দিয়ে হুবহু ফিল্টারিং (AND Operator Match)
           ========================================================= */
        // where: {
        //     AND: [
        //         {
        //             title: 'My First Post', // টাইপো ফিক্সড
        //         },
        //         {
        //             content: 'Rolando'  
        //         }
        //     ]
        // },

        /* =========================================================
           ✨ ফিচার ৩: আংশিক ম্যাচিং সার্চ (Searching Partial Match)
           ========================================================= */
        // where: {
        //     title: {
        //         contains: 'My',
        //         mode: 'insensitive'
        //     },
        //     // কনটেন্টের জন্য আংশিক ম্যাচ (নট আইডিয়াল সিঙ্গেল ফিল্ড হিসেবে)
        //     content: {
        //         contains: 'M'
        //     }
        // },

        /* =========================================================
           ✨ ফিচার ৪: ওআর অপারেটর দিয়ে যেকোনো একটি ফিল্ড সার্চ (OR Search)
           ========================================================= */
        // where: {
        //     OR: [
        //         {
        //             title: {
        //                 contains: 'my',
        //                 mode: 'insensitive'
        //             }
        //         },
        //         {
        //             content: {
        //                 contains: 'm',
        //                 mode: 'insensitive'
        //             }
        //         }
        //     ]
        // },

        /* =========================================================
           ✨ ফিচার ৫: সার্চ এবং ফিল্টারিং একসাথে কম্বাইন করা (Combined Search & Filter)
           ========================================================= */
        // where: {
        //     AND: [
        //         {
        //             OR: [
        //                 {
        //                     title: {
        //                         contains: 'My',
        //                         mode: 'insensitive'
        //                     }
        //                 },
        //                 {
        //                     content: {
        //                         contains: 'my',
        //                         mode: 'insensitive'
        //                     },
        //                 }
        //             ]
        //         },
        //         {
        //             title: 'My First Post'
        //         },
        //         {
        //             content: 'My First post'
        //         }
        //     ]
        // },

        /* =========================================================
           ✨ ফিচার ৬: পেজিনেশন লজিক (Pagination Mechanics - Take & Skip)
           ========================================================= */
        // take: 1,
        // for first page skip is 0
        // page visiting 2 => skip: 2
        // page visiting 3 => skip: 3 
        // সূত্র: (page - 1) * limit
        // উদাহরণ: page = 3, limit = 10 => (3 - 1) * 10 = 20

        /* =========================================================
           ✨ ফিচার ৭: ডাটা সর্টিং বা সিরিয়াল করা (Sorting - Field Name: asc/desc)
           ========================================================= */
        // orderBy: {
        //     createdAt: 'desc',
        //     title: 'asc',
        //     content: 'desc'
        // },

        /* =========================================================
           ✨ ফিচার ৮: ডাইনামিক সার্চ এবং ফিল্টারিং (Dynamic Searching & Filtering)
           ========================================================= */
        // where: {
        //     AND: [
        //         query.searchTerm ? {
        //             OR: [
        //                 {
        //                     title: {
        //                         contains: query.searchTerm,
        //                         mode: 'insensitive'
        //                     },
        //                 },
        //                 {
        //                     content: {
        //                         contains: query.searchTerm,
        //                         mode: 'insensitive'
        //                     }
        //                 }
        //             ]
        //         } : {},
        //         query.title ? { title: query.title } : {},
        //         query.content ? { content: query.content } : {},
        //         {
        //             tags: {
        //                 hasSome: ['']
        //             }
        //         }
        //     ]
        // },

        // 🚀 একটিভ রানটাইম কোড (Active Code)
        where: {
            AND: andConditions
        }, 

        /* =========================================================
           ✨ ফিচার ৯: ডাইনামিক পেজিনেশন এবং সর্টিং (Dynamic Pagination & Sorting)
           ========================================================= */
        take: limit,
        skip: skip,
        orderBy: {
            [sortBy]: sortOrder
        }, 

        include: {
            author: {
                omit: {
                    password: true
                }
            },
            comments: true
        }
    });

    return posts;
};

// const getPostById = async (postId: string) => {
//     const post = await prisma.post.findUniqueOrThrow({
//         where: {
//             id: postId
//         }
//     })
//     const updatedPost = await prisma.post.update({
//         where: {
//             id: postId,
//         },
//         data: {
//             views: {
//                 increment: 1
//             }
//         },
//         include: {
//             author: {
//                 omit: {
//                     password: true
//                 }
//             },
//             comments: true
//         }

//     })
//     return updatedPost

// }
const getPostById = async (postId: string) => {

    // await prisma.post.update({
    //     where : {
    //         id : postId,
    //     },
    //     data : {
    //         views : {
    //             increment : 1
    //         },
    //     }
    // })

    // throw new Error("Fake Error")

    // const post = await prisma.post.findUniqueOrThrow({
    //     where : {
    //         id : postId
    //     },

    //     include : {
    //         author : {
    //             omit : {
    //                 password : true
    //             }
    //         },

    //         comments : {
    //             where : {
    //                 status : CommentStatus.APPROVED
    //             },

    //             orderBy : {
    //                 createdAt : "desc"
    //             }
    //         },

    //         _count : {
    //             select : {
    //                 comments : true
    //             }
    //         }
    //     }
    // })

    // return post

    const transactionResult = await prisma.$transaction(
        async (tx) => {
            await tx.post.update({
                where: {
                    id: postId,
                },
                data: {
                    views: {
                        increment: 1
                    },
                }
            });
            // throw new Error("fake error")
            const post = await tx.post.findUniqueOrThrow({
                where: {
                    id: postId
                },

                include: {
                    author: {
                        omit: {
                            password: true
                        }
                    },

                    comments: {
                        where: {
                            status: CommentStatus.APPROVED
                        },

                        orderBy: {
                            createdAt: "desc"
                        }
                    },

                    _count: {
                        select: {
                            comments: true
                        }
                    }
                }
            });
            return post
        }
    );

    return transactionResult

}



const updatePost = async (postId: string, payload: IUpdatePostPayload, authorId: string, isAdmin: boolean) => {
    const post = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        }
    })

    if (!isAdmin && post.authorId !== authorId) {
        throw new Error("You are not the owner of this post!")
    }

    const result = await prisma.post.update({
        where: {
            id: postId
        },
        data: payload,
        include: {
            author: {
                omit: {
                    password: true
                }
            },
            comments: true
        }
    })

    return result;
}
const deletePost = async (postId: string, authorId: string, isAdmin: boolean) => {
    const post = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        }
    });

    if (!isAdmin && post.authorId !== authorId) {
        throw new Error("You are not the owner of this post!")
    }

    await prisma.post.delete({
        where: {
            id: postId
        }
    })

}

const getMyPosts = async (authorId: string) => {

    const result = await prisma.post.findMany({
        where: {
            authorId
        },

        orderBy: {
            createdAt: "desc"
        },

        include: {
            comments: true,
            author: {
                omit: {
                    password: true
                }
            },

            _count: {
                select: {
                    comments: true
                }
            }
        }
    });

    return result;

}


const getPostsStats = async () => {
    const transactionResult = await prisma.$transaction(
        async (tx) => {
            // const totalPosts = await tx.post.count();

            // const totalPublishedPosts = await tx.post.count({
            //     where : {
            //         status : PostStatus.PUBLISHED
            //     }
            // })
            // const totalDraftPosts = await tx.post.count({
            //     where : {
            //         status : PostStatus.DRAFT
            //     }
            // })
            // const totalArchivedPosts = await tx.post.count({
            //     where : {
            //         status : PostStatus.ARCHIVED
            //     }
            // })

            // const totalComments = await tx.comment.count();

            // const totalApprovedComments = await tx.comment.count({
            //     where : {
            //         status : CommentStatus.APPROVED
            //     }
            // });
            // const totalRejectedComments = await tx.comment.count({
            //     where : {
            //         status : CommentStatus.REJECT
            //     }
            // });

            // //Not a good approach
            // // const allPosts = await tx.post.findMany();

            // // let totalPostViews = 0;

            // // allPosts.forEach((post)=>{
            // //     totalPostViews = totalPostViews + post.views
            // // })

            // //Good Approach
            // const totalPostViewsAggregate = await tx.post.aggregate({
            //     _sum : {
            //         views : true
            //     }
            // })

            // const totalPostViews = totalPostViewsAggregate._sum.views\

            // return {
            //     totalPosts,
            //     totalPublishedPosts,
            //     totalDraftPosts,
            //     totalArchivedPosts,
            //     totalComments,
            //     totalApprovedComments,
            //     totalRejectedComments,
            //     totalPostViews
            // }


            const [
                totalPosts,
                totalPublishedPosts,
                totalDraftPosts,
                totalArchivedPosts,
                totalComments,
                totalApprovedComments,
                totalRejectedComments,
                totalPostViewsAggregate
            ] = await Promise.all([
                await tx.post.count(),
                await tx.post.count({
                    where: {
                        status: PostStatus.PUBLISHED
                    }
                }),
                await tx.post.count({
                    where: {
                        status: PostStatus.DRAFT
                    }
                }),
                await tx.post.count({
                    where: {
                        status: PostStatus.ARCHIVED
                    }
                }),
                await tx.comment.count(),
                await tx.comment.count({
                    where: {
                        status: CommentStatus.APPROVED
                    }
                }),
                await tx.comment.count({
                    where: {
                        status: CommentStatus.REJECT
                    }
                }),
                await tx.post.aggregate({
                    _sum: {
                        views: true
                    }
                })
            ]);


            return {
                totalPosts,
                totalPublishedPosts,
                totalDraftPosts,
                totalArchivedPosts,
                totalComments,
                totalApprovedComments,
                totalRejectedComments,
                totalPostViews: totalPostViewsAggregate._sum.views
            }
        }
    );

    return transactionResult
}





export const postService = {
    createPost, getAllPosts, getPostById, getMyPosts, updatePost, deletePost, getPostsStats
}