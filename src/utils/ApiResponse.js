class ApiResponse{
    constructor(statuscode,data,message="suscess"){
        this.statuscode=statuscode
        this.data=data
        this.message=message
        this.success=statuscode<400
    }
}

export { ApiResponse }