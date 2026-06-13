import User from '../models/user.models.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { ApiError } from '../utils/api-error.js';
import { ApiResponse } from '../utils/api-response.js'


const generateToken = async (id) => {
    try {

        const user = await User.findById(id);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(
            500,
            `${error} : something went wrong while generating  token:(generateToken function : auth.contollers.js`
        )
    }
};


const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body

    const existedUser = await User.findOne({
        email: email
    })

    if (existedUser) {
        throw new ApiError(409, `${error} user with this email already exists`);
    }

    const user = await User.create({
        name,
        email,
        password,
        role
    })

    const { accessToken, refreshToken } = await generateToken(user._id);

    const loggedUser = await User.findById(user._id)

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                201,
                {
                    loggedUser
                },
                "User created and loggedin successfully"
            )
        )
};


const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(401).json(
            new ApiError(
                400, "email needed for login"
            )
        )
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) return res.status(401).json(
        new ApiError(
            401,
            ` User does not exist , Please register  OR Invalid email `
        )
    )

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        new ApiError(400, "password is not corect")
    }

    const { accessToken, refreshToken } = await generateToken(user._id);

    const loggedUser = await User.findById(user._id)

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    loggedUser,
                },
                "User logged in succesfully"
            )
        )
}


const logoutUser = async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: "",
            },
        },
        {
            new: true,
        },
    );

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                {},
                "user logged out",
            )
        );
};


const getme = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json(new ApiResponse(true, user));
    } catch (err) {
        res.status(500).json(new ApiError(500, err.message));
    }
};


const refreshAccessToken = async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        return res.status(401).json(new ApiError(401, "Unauthorized - No refresh token"));
    }

    try {
        const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(401).json(new ApiError(401, "Invalid refresh token"));
        }

        if (incomingRefreshToken !== user.refreshToken) {
            return res.status(401).json(new ApiError(401, "Refresh token expired or used"));
        }

        const accessToken = user.generateAccessToken();

        const options = {
            httpOnly: true,
            secure: true,
        }

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .json(new ApiResponse(200, { accessToken }, "Access token refreshed"));

    } catch (error) {
        return res.status(401).json(new ApiError(401, "Invalid refresh token"));
    }
};


export { registerUser, loginUser, logoutUser, getme ,refreshAccessToken};