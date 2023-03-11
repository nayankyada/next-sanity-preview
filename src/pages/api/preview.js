export default function preview(req, res) {
    res.setPreviewData({})
    res.writeHead(307, {Location: '/htmlpreview'})
    res.end()
}