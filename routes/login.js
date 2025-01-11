router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    const query = `SELECT * FROM users WHERE email = ?`;
    connection.query(query, [email], async (err, results) => {
      if (err || results.length === 0) {
        return res.status(400).json({ message: 'Invalid credentials.' });
      }
  
      const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials.' });
      }
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ token, user: { id: user.id, name: user.name, role: user.role } });
    });
  });
  
  module.exports = router;
  